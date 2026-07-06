include $(TOPDIR)/rules.mk

PKG_NAME:=luci-theme-r619-3d
PKG_VERSION:=1.1.0
PKG_RELEASE:=1

LUCI_TITLE:=R619 3D LuCI Theme
LUCI_DEPENDS:=+luci-base +luci-theme-bootstrap

PKG_LICENSE:=Apache-2.0
PKG_MAINTAINER:=Codex

define Package/luci-theme-r619-3d/postrm
#!/bin/sh
[ -n "$${IPKG_INSTROOT}" ] || {
	uci -q delete luci.themes.R6193D
	uci commit luci
}
endef

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
