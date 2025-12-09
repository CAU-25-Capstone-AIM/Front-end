import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { searchAll } from '../../api/searchApi';

export const Navbar: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    try {
      setIsSearching(true);

      const result = await searchAll(trimmed);

      // 1) 정확히 이름이 같은 애널리스트들
      const exactAnalysts = result.analysts.filter(
        (a) => a.analystName === trimmed,
      );

      // 2) 정확히 종목명이 같은 종목들
      const exactStocks = result.stocks.filter((s) => s.stockName === trimmed);

      if (exactAnalysts.length === 1 && exactStocks.length === 0) {
        navigate(`/analysts/${exactAnalysts[0].analystId}`);
        setKeyword(''); // 검색 성공 시 입력값 초기화
        return;
      }

      if (exactStocks.length === 1 && exactAnalysts.length === 0) {
        navigate(`/stocks/${exactStocks[0].stockId}`);
        setKeyword(''); // 검색 성공 시 입력값 초기화
        return;
      }

      // 그 외 모든 경우: 모호하거나 없음
      alert(
        '정확히 일치하는 검색 결과를 찾지 못했습니다.\n정확한 이름 또는 종목명을 입력해 주세요.',
      );
    } catch (error) {
      console.error(error);
      alert('검색 중 오류가 발생했습니다.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <NavbarContainer>
      <Logo to="/">
        <LogoImage src="/logo1.png" alt="AIM Logo" />
      </Logo>

      <SearchForm
        onSubmit={(e) => {
          e.preventDefault();
          if (!isSearching) {
            handleSearch();
          }
        }}
      >
        <SearchInput
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="애널리스트 이름 또는 종목명"
          disabled={isSearching}
        />
        <SearchButton type="submit" disabled={isSearching}>
          {isSearching ? '검색 중…' : '검색'}
        </SearchButton>
      </SearchForm>

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
  gap: 24px;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  height: 48px;
  flex-shrink: 0;
`;

const LogoImage = styled.img`
  height: 100%;
  width: auto;
  object-fit: contain;
  cursor: pointer;
  border-radius: 12px;
`;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  max-width: 400px;
`;

const SearchInput = styled.input`
  flex: 1;
  height: 36px;
  padding: 0 12px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: #3730a3;
    box-shadow: 0 0 0 3px rgba(55, 48, 163, 0.1);
  }

  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const SearchButton = styled.button`
  height: 36px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  background-color: #3730a3;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background-color: #312e81;
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 12px;
  flex-shrink: 0;
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

