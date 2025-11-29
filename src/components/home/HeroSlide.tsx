import React from 'react';
import styled from 'styled-components';
import type { HeroSlideConfig } from './HeroSlider';

export type HeroSlideProps = {
  slide: HeroSlideConfig;
  onClickCta: (target: HeroSlideConfig['ctaTarget']) => void;
};

const titleWithLineBreak = (value: string) => {
  const lines = value.split('\n');
  return lines.map((line, index) => (
    <React.Fragment key={`${line}-${index}`}>
      {line}
      {index !== lines.length - 1 && <br />}
    </React.Fragment>
  ));
};

const illustrationLabel: Record<HeroSlideConfig['illustrationType'], string> = {
  intro: 'AIM',
  analyst: 'Analyst',
  sector: 'Sector',
};

export const HeroSlide: React.FC<HeroSlideProps> = ({ slide, onClickCta }) => {
  return (
    <SlideContainer>
      <LeftColumn>
        <Title>{titleWithLineBreak(slide.title)}</Title>
        <Subtitle>{slide.subtitle}</Subtitle>
        <Description>{slide.description}</Description>
        <CtaButton type="button" onClick={() => onClickCta(slide.ctaTarget)}>
          {slide.ctaLabel}
        </CtaButton>
      </LeftColumn>
      <RightColumn>
        <IllustrationBubble>
          <IllustrationLabel>{illustrationLabel[slide.illustrationType]}</IllustrationLabel>
        </IllustrationBubble>
      </RightColumn>
    </SlideContainer>
  );
};

const SlideContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 48px;
  align-items: center;
  justify-content: space-between;
`;

const LeftColumn = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  line-height: 1.3;
`;

const Subtitle = styled.p`
  margin: 12px 0 0;
  font-size: 16px;
  color: #4b5563;
  line-height: 1.5;
`;

const Description = styled.p`
  margin: 8px 0 24px;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
`;

const CtaButton = styled.button`
  align-self: flex-start;
  padding: 10px 20px;
  border-radius: 999px;
  border: none;
  background-color: #3b82f6;
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #2563eb;
  }
`;

const RightColumn = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IllustrationBubble = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: #eef2ff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 15px 30px rgba(15, 23, 42, 0.08);
`;

const IllustrationLabel = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: #4338ca;
`;

export default HeroSlide;

