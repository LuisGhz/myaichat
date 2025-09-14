import { Layout, Grid } from "antd";
import { useEffect, useState, useCallback } from "react";
import { useAppStore, useAppStoreActions } from "store/app/AppStore";

const { Sider } = Layout;

export const SideNav = () => {
  const { sideNavCollapsed } = useAppStore();
  const { setSideNavCollapsed } = useAppStoreActions();
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;

  const calculateSiderWidth = useCallback((mobile: boolean) => {
    const maxWidth = 250;
    if (typeof window === "undefined") {
      // fallback for SSR / tests
      return `${maxWidth}px`;
    }
    const ratio = mobile ? 0.8 : 0.25;
    const px = Math.round(window.innerWidth * ratio);
    return `${Math.min(px, maxWidth)}px`;
  }, []);

  const [siderWidth, setSiderWidth] = useState<string>(() =>
    calculateSiderWidth(isMobile)
  );

  useEffect(() => {
    // update width when breakpoint changes
    setSiderWidth(calculateSiderWidth(isMobile));
    const onResize = () => setSiderWidth(calculateSiderWidth(isMobile));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isMobile, calculateSiderWidth]);

  useEffect(() => {
    if (isMobile) {
      setSideNavCollapsed(true);
      return;
    }
    setSideNavCollapsed(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  const toggle = () => {
    setSideNavCollapsed(!sideNavCollapsed);
  };

  return (
    <>
      <Sider
        className={`${isMobile ? "!absolute !top-0 !left-0 !z-50 !h-dvh" : ""}`}
        width={siderWidth}
        collapsedWidth={0}
        collapsible
        collapsed={sideNavCollapsed}
        trigger={null}
        aria-hidden={sideNavCollapsed}
      >
        <div className="flex justify-end">
          <button
            className="m-2 p-1 border rounded"
            onClick={toggle}
            aria-expanded={!sideNavCollapsed}
            aria-label="Toggle side navigation"
          >
            Toggle
          </button>
        </div>
        <p className="dark:text-white">SideNav</p>
      </Sider>
    </>
  );
};
