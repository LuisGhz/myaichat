import { Layout, Grid } from "antd";
import { useEffect, useState, useCallback } from "react";
import { useAppStore, useAppStoreActions } from "store/app/AppStore";
import { SideNavHeader } from "./SideNavHeader";
import { SideNavActionButtons } from "./SideNavActionButtons";
import { ChatsList } from "./ChatsList";
import { UserSummary } from "./UserSummary";

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
    const ratio = mobile ? 0.8 : 0.35;
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

  const handleBackdropClick = () => {
    if (isMobile) {
      setSideNavCollapsed(true);
    }
  };

  return (
    <>
      {/* Backdrop overlay for mobile */}
      {!sideNavCollapsed && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}

      <Sider
        className={`${
          isMobile ? "!absolute !top-0 !left-0 !z-50 !h-dvh" : ""
        } app-bg-darker !border-r !border-woodsmoke-300 dark:!border-woodsmoke-700 shadow-lg transition-all`}
        width={siderWidth}
        collapsedWidth={0}
        collapsible
        collapsed={sideNavCollapsed}
        trigger={null}
        aria-hidden={sideNavCollapsed}
      >
        <div className="flex h-full flex-col gap-2.5 overflow-y-auto scroll-hidden">
          <SideNavHeader />
          <UserSummary />
          <SideNavActionButtons />
          <ChatsList />
        </div>
      </Sider>
    </>
  );
};
