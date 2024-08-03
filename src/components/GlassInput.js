import styled from "styled-components";

const Input = styled.input.attrs(props => ({
  type: props.type || 'text', // 기본 type을 text로 설정
}))`
  margin: 10px 0;
  padding: 15px 10px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  width: 100%;
  box-sizing: border-box;

  &::placeholder {
    color: #ccc;
  }

  &:focus {
    outline: none;
  }
`;

const GlassInput = ({ type, children, placeholder, value, onChange, required }) => {
  return (
    <Input
      type={type} // 추가: type을 전달
      onChange={onChange}
      placeholder={placeholder}
      value={value}
      required={required}>
      {children}
    </Input>
  );
}

export default GlassInput;
