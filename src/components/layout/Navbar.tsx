import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import styled from 'styled-components';

export const Navbar: React.FC = () => {
  return (
    <NavbarContainer>
      <Logo to="/">
        <LogoImage src="/logo1.png" alt="AIM Logo" />
      </Logo>
      <NavLinks>
        <NavItem to="/" end>
          홈
        </NavItem>
        <NavItem to="/analysts">
          애널리스트 랭킹
        </NavItem>
        <NavItem to="/stocks">
          종목 랭킹
        </NavItem>
        <NavItem to="/sectors">
          섹터 랭킹
        </NavItem>
      </NavLinks>
    </NavbarContainer>
  );
};

const NavbarContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  z-index: 100;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  height: 48px;
`;

const LogoImage = styled.img`
  height: 100%;
  width: auto;
  object-fit: contain;
  cursor: pointer;
  border-radius: 12px;
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 12px;
`;

const NavItem = styled(NavLink)`
  font-size: 14px;
  color: #4b5563;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 999px;
  transition: background-color 0.2s ease, color 0.2s ease;

  &.active {
    background-color: #e0e7ff;
    color: #3730a3;
    font-weight: 600;
  }

  &:hover {
    background-color: #f3f4f6;
  }
`;

export default Navbar;

