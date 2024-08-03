import styled from "styled-components";


const TopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 999;
  padding: 10px 20px;
`;


const GlassTitle  = ({ children }) => {

    return(
        <TopContainer>
            {children}
        </TopContainer>
    )

}

export default GlassTitle;