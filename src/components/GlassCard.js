import styled from "styled-components";


const GlassContainer = styled.div`
  width: ${props => props.width ? props.width : 'auto'};
  height: ${props => props.height ? props.height : 'auto'};
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin:  ${props => props.margin ? props.margin : '10px 0;'};
  padding: 20px;
  text-align: left;
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const GlassCard = ({ children, width, height, margin, onClick }) => {

    return (
        <GlassContainer width={width} height={height} margin={margin} onClick={onClick}>
            {children}
        </GlassContainer>
    )

}

export default GlassCard;