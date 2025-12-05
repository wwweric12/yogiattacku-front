import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const accessToken = request.cookies.get('ACCESS_TOKEN')?.value
    const refreshToken = request.cookies.get('REFRESH_TOKEN')?.value;


    const publicPaths = ['/',];
    const isPublicPath = publicPaths.includes(request.nextUrl.pathname) || request.nextUrl.pathname.startsWith('/auth/');

    // 1. 토큰 없고 공개 경로 아님 -> 로그인 페이지로
    if (!accessToken && !refreshToken && !isPublicPath) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // 2. 엑세스 토큰 만료 & 리프레시 토큰 존재 -> 갱신 시도
    if (!accessToken && refreshToken) {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;

            // 백엔드 요청
            const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Cookie': `REFRESH_TOKEN=${refreshToken}`
                }
            });

            if (!refreshResponse.ok) {
                throw new Error('Refresh failed');
            }

            // 1. 백엔드에서 온 Set-Cookie 헤더들을 가져옵니다. (배열 형태)
            // Node.js 18+ 및 Next.js Edge Runtime에서는 getSetCookie() 사용 권장
            const newSetCookies = refreshResponse.headers.getSetCookie();

            // 2. 다음 단계(Page)로 넘길 새로운 Request 헤더 준비
            const requestHeaders = new Headers(request.headers);

            // 3. 브라우저에게 보낼 Response 객체 미리 생성
            const response = NextResponse.next({
                request: {
                    headers: requestHeaders,
                },
            });

            // 4. 파싱 로직: newSetCookies 배열을 순회하며 처리
            let newAccessTokenValue = '';
            let newRefreshTokenValue = '';

            newSetCookies.forEach(cookieString => {
                // (A) 브라우저용: 백엔드가 준 쿠키 설정을 그대로 미들웨어 응답에 심습니다.
                response.headers.append('Set-Cookie', cookieString);

                // (B) 서버 컴포넌트용: 값만 추출 (단순 파싱)
                // 예: "accessToken=abcde12345; Path=/; HttpOnly"
                const [nameValue] = cookieString.split(';'); // "accessToken=abcde12345"
                const [name, value] = nameValue.split('=');   // name="accessToken", value="abcde12345"

                if (name.trim() === 'ACCESS_TOKEN') {
                    newAccessTokenValue = value;
                }
                if (name.trim() === 'REFRESH_TOKEN') {
                    newRefreshTokenValue = value;
                }
            });

            // 5. 서버 컴포넌트(Page.tsx)가 즉시 인식하도록 Request 헤더 업데이트
            // 새로 받은 값이 있으면 그걸 쓰고, 없으면(갱신 안된 경우) 기존 거 유지
            if (!newAccessTokenValue) {
                throw new Error('Refresh response did not include new access token');
            }
            requestHeaders.set('Cookie', `ACCESS_TOKEN=${newAccessTokenValue || accessToken}; REFRESH_TOKEN=${newRefreshTokenValue || refreshToken}`);

            return response;

        } catch (error) {
            console.error("Middleware refresh error:", error);

            // 실패 시 로그아웃 처리
            const response = NextResponse.redirect(new URL('/', request.url));
            response.cookies.delete('ACCESS_TOKEN');
            response.cookies.delete('REFRESH_TOKEN');
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg).*)',
    ],
};