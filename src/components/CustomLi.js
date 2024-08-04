import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { baseAPI } from "../config";
import { ko } from "date-fns/locale";
import { differenceInDays, formatDistanceToNow, parseISO } from "date-fns";

const Container = styled.li`
  display: flex;
  justify-content: space-between;
  margin: 5px 0;
  list-style: none;
  padding: 3px 0px;
  cursor: pointer;
`;

const MultiLineEllipsisText = styled.div`
  width: 80%;
  font-size: 1em;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const CustomLi = ({ data, isMine = false }) => {
  const navigate = useNavigate();

  const formatRelativeTime = (dateString) => {
    const date = parseISO(dateString);
    const now = new Date();
    const daysDifference = differenceInDays(now, date);

    if (daysDifference < 1) {
      return formatDistanceToNow(date, { addSuffix: true, locale: ko });
    }

    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const handleClick = async () => {
    try {
      console.log(data.postId);
      await baseAPI.get(`api/posts/${data.postId}`);
      navigate(`/post/${data.postId}`);
    } catch (error) {
      alert("삭제된 게시글입니다.");
      window.location.reload(); // 새로고침
    }
  };

  return (
    <Container onClick={handleClick}>
      {isMine && data.content ? (
        <>
          <MultiLineEllipsisText>{data.content}</MultiLineEllipsisText>
          <div style={{ fontSize: 10, width: "20%", textAlign: "right" }}>
            {formatRelativeTime(data.createTime)}
          </div>
        </>
      ) : isMine && data.title ? (
        <>
          <MultiLineEllipsisText>{data.title}</MultiLineEllipsisText>
          <div style={{ fontSize: 10, width: "20%", textAlign: "right" }}>
            {formatRelativeTime(data.createTime)}
          </div>
        </>
      ) : (
        <>
          <MultiLineEllipsisText>{data.title}</MultiLineEllipsisText>
          <div style={{ fontSize: 10, width: "20%", textAlign: "right" }}>
            {data.writerName}
          </div>
        </>
      )}
    </Container>
  );
};

export default CustomLi;
