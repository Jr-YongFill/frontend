import styled from "styled-components";

const CustomWrapper = styled.div`
  display: flex;
  margin: 10px;
  justify-content: center;
  align-content: center;  
`;

const Wrapper = ({ children }) => {

    return(
        <CustomWrapper>
            {children}
        </CustomWrapper>
    )

}

export default Wrapper;