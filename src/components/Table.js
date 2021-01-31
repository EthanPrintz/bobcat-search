import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import grey from "@material-ui/core/colors/grey";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

export default function Table({
  name,
  totalRatings,
  overallRating,
  ratings,
  isMore,
  onLoadMore,
}) {
  return (
    <React.Fragment>
      <MetaContainer>
        <div className="instructorName">{name}</div>
        <div>{`${totalRatings} review${totalRatings >= 1 ? "s" : ""}`}</div>
        <div>
          {overallRating > -1
            ? `Overall ${overallRating}`
            : "No Overall Rating"}
        </div>
      </MetaContainer>
      <RatingTable>
        <TableHeaders>
          <tr>
            <Header>Information</Header>
            <Header comment={true}>Comment</Header>
          </tr>
        </TableHeaders>
        <TableBody>
          {ratings.length > 0 &&
            ratings.map((rating, idx) => {
              const date = new Date(rating.rTimestamp);
              return (
                <RatingContainer key={rating.id} isOdd={idx % 2 === 0}>
                  <InfoContainer>
                    <Rating>{rating.rClass}</Rating>
                    <Rating>{`Overall: ${rating.rOverall}`}</Rating>
                    <Rating>{`Helpful: ${rating.rHelpful}`}</Rating>
                    <Rating>{`${
                      date.getMonth() + 1
                    }/${date.getDate()}/${date.getFullYear()}`}</Rating>
                  </InfoContainer>
                  <Comment
                    dangerouslySetInnerHTML={{ __html: rating.rComments }}
                  />
                </RatingContainer>
              );
            })}
        </TableBody>
      </RatingTable>
      {isMore && (
        <ExpandButton onClick={onLoadMore}>
          <ExpandMoreIcon
            style={{
              color: grey[700],
            }}
          />
          <span style={{ color: grey[700] }}>More Reviews</span>
        </ExpandButton>
      )}
    </React.Fragment>
  );
}

Table.propTypes = {
  name: PropTypes.string.isRequired,
  totalRatings: PropTypes.number.isRequired,
  overallRating: PropTypes.number.isRequired,
  ratings: PropTypes.array.isRequired,
  isMore: PropTypes.bool.isRequired,
  onLoadMore: PropTypes.func.isRequired,
};

const MetaContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: calc(0.8vmin + 0.8rem);
  font-size: 1.4rem;
  color: var(--grey200);
  font-weight: bold;
  background: linear-gradient(
    167deg,
    var(--purpleMain) 21%,
    #712991 60%,
    rgba(135, 37, 144, 1) 82%
  );

  > div {
    padding: 0.2rem 0;
  }

  & > .instructorName {
    font-size: 2rem;
  }
`;

const RatingTable = styled.table`
  width: 40vw;
  border-spacing: 0;
  border-collapse: collapse;
`;

const TableHeaders = styled.thead`
  width: 100%;
`;

const Header = styled.th`
  border-top: 1.2px solid var(--grey600);
  border-bottom: 1.2px solid var(--grey600);
  padding: 1rem;
  background-color: var(--grey500);
  border-left: ${(props) =>
    props.comment ? "1.2px solid var(--grey600)" : ""};
`;

const TableBody = styled.tbody`
  width: 100%;
  background-color: var(--grey400);
  height: 100vh;
`;

const RatingContainer = styled.tr`
  padding: 0.4rem;
  font-size: 1rem;
  color: var(--grey900);
  font-weight: bold;
  background-color: ${(props) =>
    props.isOdd ? "var(--grey400)" : "var(--grey300)"};
  border-bottom: 1.2px solid var(--grey600);
  border-top: 1.2px solid var(--grey600);
`;

const InfoContainer = styled.td`
  text-align: center;
  vertical-align: middle;
  padding: 0.4rem 0;
`;

const Rating = styled.p`
  padding: 0.1rem 0.6rem;
`;

const Comment = styled.td`
  padding: 1rem;
  border-left: 1.2px solid var(--grey600);
  width: 75%;
`;

const ExpandButton = styled.div`
  font-size: 1.1rem;
  width: 100%;
  padding: 0.8rem 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: ${grey[200]};
  transition: 0.1s;

  :hover {
    background-color: ${grey[300]};
  }

  & > svg {
    margin-right: 0.65rem;
  }
`;
