import styled from "styled-components";
import background from "../assets/background.png"

const CustomWrapper = styled.div`
  display: flex;
  margin:  auto 10vw;
  justify-content: center;
  align-content: center;
`;
const WrapperContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url(${background});
  background-size: cover; 
  background-position: center;
  padding: 20px;
  box-sizing: border-box;
  min-height: 100vh;
`;

const Wrapper = ({ children }) => {

    return(
        <WrapperContainer>
            <CustomWrapper>
              
            {children}
            </CustomWrapper>
        </WrapperContainer>
        
    )

}

export default Wrapper;