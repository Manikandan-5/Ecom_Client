import {
  Disclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  DisclosureButton,
  DisclosurePanel
} from "@headlessui/react";

import { useContext, useState, useEffect } from "react";

import { AuthContext } from "../context/AuthContext";

import {
  ShoppingCartIcon,
  UserIcon,
  HomeIcon,
  Bars3Icon,
  XMarkIcon
} from "@heroicons/react/24/outline";

import {
  Link,
  useNavigate,
  useLocation
} from "react-router-dom";

import logo from "../assets/logo.png";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {

  const navigate = useNavigate();
  const location = useLocation();

  const [cartCount, setCartCount] =
    useState(0);

  const { user } =
    useContext(AuthContext);

  useEffect(() => {

    updateCartCount();

    window.addEventListener(
      "cartUpdated",
      updateCartCount
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        updateCartCount
      );
    };

  }, []);

  const updateCartCount = () => {

    const cart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    setCartCount(cart.length);
  };

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");

    navigate("/login");
  };

  const isAdmin =
    user?.role === "admin";

  const isActive = (path) =>
    location.pathname === path;

  return (

    <Disclosure
      as="nav"
      className="bg-white shadow sticky top-0 z-50"
    >

      {({ open }) => (

        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="flex justify-between items-center h-16">

              {/* LEFT LOGO */}
              <Link
                to="/"
                className="flex items-center shrink-0"
              >

                <img
                  src={logo}
                  alt="logo"
                  className="
                    h-10 w-auto
                    sm:h-11
                    md:h-12
                    object-contain
                  "
                />

              </Link>

              {/* DESKTOP MENU */}
              <div className="hidden md:flex items-center gap-3">

                <NavLink
                  to="/"
                  active={isActive("/")}
                >
                  <HomeIcon className="h-5 w-5" />
                  Home
                </NavLink>

                <NavLink
                  to="/cart"
                  active={isActive("/cart")}
                >

                  <div className="relative">

                    <ShoppingCartIcon className="h-5 w-5" />

                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-[10px] px-1">
                        {cartCount}
                      </span>
                    )}

                  </div>

                  Cart

                </NavLink>

                {isAdmin && (
                  <NavLink
                    to="/admin"
                    active={isActive("/admin")}
                  >
                    Admin
                  </NavLink>
                )}

              </div>

              {/* RIGHT SIDE */}
              <div className="flex items-center gap-3">

                {/* PROFILE */}
                <Menu as="div" className="relative">

                  <MenuButton>

                    {user ? (

                      <div className="h-9 w-9 rounded-full bg-black text-white flex items-center justify-center">
                        {user.name?.[0] || "U"}
                      </div>

                    ) : (

                      <UserIcon className="h-8 w-8 text-black" />

                    )}

                  </MenuButton>

                  <MenuItems className="absolute right-0 mt-2 bg-white shadow rounded w-48 p-2">

                    {user ? (

                      <>
                        <div className="px-3 py-2 border-b mb-2">

                          <p className="font-semibold">
                            {user.name}
                          </p>

                          <p className="text-sm text-gray-500 break-all">
                            {user.email}
                          </p>

                        </div>

                        <MenuItem>
                          <button
                            onClick={logout}
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                          >
                            Logout
                          </button>
                        </MenuItem>
                      </>

                    ) : (

                      <>
                        <MenuItem>
                          <Link
                            to="/login"
                            className="block px-3 py-2 hover:bg-gray-100 rounded"
                          >
                            Login
                          </Link>
                        </MenuItem>

                        <MenuItem>
                          <Link
                            to="/register"
                            className="block px-3 py-2 hover:bg-gray-100 rounded"
                          >
                            Register
                          </Link>
                        </MenuItem>
                      </>

                    )}

                  </MenuItems>

                </Menu>

                {/* MOBILE MENU BUTTON */}
                <DisclosureButton className="md:hidden p-2 rounded hover:bg-gray-100">

                  {open ? (
                    <XMarkIcon className="h-6 w-6" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" />
                  )}

                </DisclosureButton>

              </div>

            </div>

          </div>

          {/* MOBILE MENU */}
          <DisclosurePanel className="md:hidden px-4 pb-4">

            <div className="flex flex-col gap-2">

              <NavLink
                to="/"
                active={isActive("/")}
              >
                <HomeIcon className="h-5 w-5" />
                Home
              </NavLink>

              <NavLink
                to="/cart"
                active={isActive("/cart")}
              >

                <div className="relative">

                  <ShoppingCartIcon className="h-5 w-5" />

                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-[10px] px-1">
                      {cartCount}
                    </span>
                  )}

                </div>

                Cart

              </NavLink>

              {isAdmin && (
                <NavLink
                  to="/admin"
                  active={isActive("/admin")}
                >
                  Admin
                </NavLink>
              )}

            </div>

          </DisclosurePanel>

        </>
      )}

    </Disclosure>
  );
}

const NavLink = ({
  to,
  children,
  active
}) => (

  <Link
    to={to}
    className={classNames(
      active
        ? "bg-black text-white"
        : "text-black hover:bg-gray-100",
      "flex items-center gap-2 px-3 py-2 rounded transition"
    )}
  >
    {children}
  </Link>

);