import { useEffect } from 'react';

const TawkToWidget = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://embed.tawk.to/683dc0b4e31f09190a5c0ae7/1isojhgm5";
    script.async = true;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.body.appendChild(script);

    script.onload = () => {
      // Thêm khoảng thời gian chờ 1 giây (1000ms) trước khi áp dụng customStyle
      setTimeout(() => {
        if (window.Tawk_API) {
          window.Tawk_API.customStyle = {
            visibility: {
              desktop: {
                xOffset: 0,
                yOffset: 60,
                position: 'br'
              },
              mobile: {
                xOffset: 0,
                yOffset: 60,
                position: 'br'
              }
            }
          };
        }
      }, 500); // Thay đổi thời gian chờ nếu cần
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
};

export default TawkToWidget;