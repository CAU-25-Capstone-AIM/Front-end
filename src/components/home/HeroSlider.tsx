import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { HeroSlide } from './HeroSlide';

export type HeroSlideConfig = {
  id: 'intro' | 'analyst' | 'asset';
  title: string;
  subtitle: string;
  description: string;
  ctaLabel: string;
  ctaTarget: 'intro' | 'analystRanking' | 'stockRanking' | 'sectorRanking';
  illustrationType: 'intro' | 'analyst' | 'sector';
};

const AUTO_INTERVAL_MS = 5000;

const slides: HeroSlideConfig[] = [
  {
    id: 'intro',
    title: '매수 편향된 리포트 대신,\n성과로 검증된 인사이트',
    subtitle: '애널리스트 리포트의 매수 쏠림을 걷어내고, 실제 성과로 신뢰도를 평가합니다.',
    description:
      'Strong Buy부터 Strong Sell까지 의견 분포를 확인하고, 수익률과 목표가 오차율로 애널리스트를 비교하세요.',
    ctaLabel: 'AIM 서비스 소개 보기',
    ctaTarget: 'intro',
    illustrationType: 'intro',
  },
  {
    id: 'analyst',
    title: '어떤 애널리스트를 믿을지,\n숫자로 보여드립니다.',
    subtitle: '정답률 · 평균 수익률 · 목표가 오차율 기반 애널리스트 랭킹',
    description: '성과로 검증된 상위 애널리스트의 최신 리포트만 모아볼 수 있습니다.',
    ctaLabel: '애널리스트 랭킹 보러가기',
    ctaTarget: 'analystRanking',
    illustrationType: 'analyst',
  },
  {
    id: 'asset',
    title: '전문가 의견을 모아,\n기대 수익률이 높은 종목을 찾습니다.',
    subtitle: '여러 애널리스트 리포트를 종합해 종목·섹터별 인사이트 제공',
    description: '종목별 상승 여력과 매수 비율, 섹터별 매수 의견 집중도를 한눈에 비교하세요.',
    ctaLabel: '종목 랭킹 보러가기',
    ctaTarget: 'stockRanking',
    illustrationType: 'sector',
  },
];

export const HeroSlider: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  
  // 타이머 관련 상태를 ref로 관리
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const remainingTimeRef = useRef<number>(AUTO_INTERVAL_MS);

  // 다음 슬라이드로 이동하는 함수
  const goToNextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
    remainingTimeRef.current = AUTO_INTERVAL_MS;
    startTimeRef.current = Date.now();
  };

  // 타이머 시작 함수
  const startTimer = (delay: number = AUTO_INTERVAL_MS) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    startTimeRef.current = Date.now();
    remainingTimeRef.current = delay;
    
    timerRef.current = setTimeout(() => {
      goToNextSlide();
    }, delay);
  };

  // 타이머 일시 정지 함수
  const pauseTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    // 경과 시간 계산
    const elapsed = Date.now() - startTimeRef.current;
    remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
  };

  // 타이머 재개 함수
  const resumeTimer = () => {
    startTimer(remainingTimeRef.current);
  };

  useEffect(() => {
    if (isHovered) {
      pauseTimer();
    } else {
      resumeTimer();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isHovered, activeIndex]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const handleSelect = (index: number) => {
    setActiveIndex(index);
  };

  const handleCta = (target: HeroSlideConfig['ctaTarget']) => {
    switch (target) {
      case 'analystRanking':
        navigate('/analysts');
        break;
      case 'stockRanking':
        navigate('/stocks');
        break;
      case 'sectorRanking':
        navigate('/sectors');
        break;
      case 'intro':
      default:
        navigate('/');
    }
  };

  return (
    <SliderWrapper
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ArrowButton type="button" aria-label="이전 슬라이드" onClick={handlePrev} $position="left">
        ‹
      </ArrowButton>
      <SlideRegion>
        <HeroSlide slide={slides[activeIndex]} onClickCta={handleCta} />
      </SlideRegion>
      <ArrowButton type="button" aria-label="다음 슬라이드" onClick={handleNext} $position="right">
        ›
      </ArrowButton>
      <DotNavigation>
        {slides.map((slide, index) => (
          <DotButton
            key={slide.id}
            type="button"
            aria-label={`${slide.id} 슬라이드로 이동`}
            aria-current={index === activeIndex}
            onClick={() => handleSelect(index)}
            $active={index === activeIndex}
          />
        ))}
      </DotNavigation>
    </SliderWrapper>
  );
};

const SliderWrapper = styled.section`
  position: relative;
  width: 100%;
  min-height: 320px;
  background: linear-gradient(120deg, #eef2ff 0%, #fdf2f8 100%);
  border-radius: 16px;
  padding: 32px 64px;
  display: flex;
  align-items: center;
  overflow: hidden;
`;

const SlideRegion = styled.div`
  flex: 1;
`;

const ArrowButton = styled.button<{ $position: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${(props) => (props.$position === 'left' ? 'left: 16px;' : 'right: 16px;')}
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: #ffffff;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.15);
  cursor: pointer;
  font-size: 24px;
  color: #1f2937;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-50%) scale(1.05);
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.2);
  }
`;

const DotNavigation = styled.div`
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
`;

const DotButton = styled.button<{ $active: boolean }>`
  width: ${(props) => (props.$active ? '12px' : '8px')};
  height: ${(props) => (props.$active ? '12px' : '8px')};
  border-radius: 50%;
  border: none;
  background: ${(props) => (props.$active ? '#4c1d95' : '#d1d5db')};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #4c1d95;
    width: 12px;
    height: 12px;
  }
`;

export default HeroSlider;

