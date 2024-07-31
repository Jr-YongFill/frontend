//정보게시판 메인페이지
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  margin: 10px;
  justify-content: center;
  align-content: center;  
`;

const ContainerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;  
`;


const CommunityInfo = () => {

  useEffect(() => {
    
  }, []);

  return (
    <div>
      <Header />
      <Wrapper>
        <ContainerWrapper>
            정보게시판 메인페이지
        </ContainerWrapper>
      </Wrapper>
    </div>
  );
};

export default CommunityInfo;
