"use client";

import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/apis/constants";

export function KakaoLoginButton() {
  const handleLogin = () => {
    window.location.href = `${BASE_URL}/oauth2/authorization/kakao`;
  };

  return (
    <Button
      onClick={handleLogin}
      className="bg-[#FEE500] text-[#000000] hover:bg-[#FEE500]/90 font-medium"
    >
      카카오 로그인
    </Button>
  );
}
