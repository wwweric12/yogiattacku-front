import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isTokenExpired, refreshAccessTokenForMiddleware } from '@/apis/auth/token';

export async function middleware(request: NextRequest) {
    const accessToken = request.cookies.get('ACCESS_TOKEN')?.value;
    const refreshToken = request.cookies.get('REFRESH_TOKEN')?.value;

    const publicPaths = ['/login'];
    const isPublicPath = publicPaths.includes(request.nextUrl.pathname) || request.nextUrl.pathname.startsWith('/auth/');

    // 1. 비로그인 접근 제어
    if (!accessToken && !refreshToken && !isPublicPath) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 2. 로그인 상태에서 로그인 페이지 접근 제어
    if ((accessToken || refreshToken) && request.nextUrl.pathname === '/login' && !request.nextUrl.searchParams.get('session')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // 3. 토큰 갱신 로직
    // 조건: (아예 없거나 OR 있어도 만료되었고) AND (리프레시 토큰은 있음)
    const shouldRefresh = (!accessToken || isTokenExpired(accessToken)) && refreshToken;

    if (shouldRefresh && !request.nextUrl.searchParams.get('session')) {
        try {
            const refreshResponse = await refreshAccessTokenForMiddleware(refreshToken);

            if (!refreshResponse.ok) {
                throw new Error('Refresh failed');
            }

            const newSetCookies = refreshResponse.headers.getSetCookie();

            // 응답 객체 생성
            const response = NextResponse.next();

            // 쿠키 동기화 로직
            newSetCookies.forEach(cookieString => {
                // (A) 브라우저 응답 헤더에 설정 (Set-Cookie)
                response.headers.append('Set-Cookie', cookieString);

                // (B) 서버 컴포넌트(Request) 업데이트를 위해 값 추출
                // 복잡한 파싱 대신 간단하게 Key=Value만 분리하여 request.cookies에 set 합니다.
                const [keyVal] = cookieString.split(';');
                const [key, value] = keyVal.split('=');

                if (key && value) {
                    // request.cookies.set을 사용하면 Next.js가 알아서 헤더를 관리해줍니다.
                    request.cookies.set(key.trim(), value.trim());
                }
            });

            return response;

        } catch (error) {
            console.error("Middleware refresh error:", error);
            const response = NextResponse.redirect(new URL('/login?session=expired', request.url));
            response.cookies.delete('ACCESS_TOKEN');
            response.cookies.delete('REFRESH_TOKEN');
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|mockServiceWorker.js).*)',
    ],
};