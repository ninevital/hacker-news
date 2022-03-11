import React, { useState, useEffect, useRef } from "react";
import { ListGroup } from "react-bootstrap";
import { Badge } from "react-bootstrap";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { decode } from "html-entities";
import reactStringReplace from "react-string-replace";
import "./Comments.css";

export default function SingleComment({ commentID }) {
  const [comment, setComment] = useState({});
  const [showResults, setShowResults] = useState(false);
  const mountedRef = useRef(true);
  const onClickHandler = () => setShowResults(!showResults);

  useEffect(() => {
    const fetchData = async () => {
      await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${commentID}.json?print=pretty`
      )
        .then((res) => res.json())
        .then(
          (result) => {
            setComment(result);
          },
          (error) => {
            console.log(error);
          }
        );
      return true;
    };

    fetchData();
    return () => {
      mountedRef.current = false;
    };
  }, [commentID]);

  if (!comment) return false;

  const nestedComments = (comment.kids || []).map((c) => {
    return <SingleComment key={c} commentID={c} />;
  });

  const action = () => {
    let action = true;
    if (!comment.kids) {
      action = false;
    }
    return action;
  };

  return (
    <div className="container">
      <ListGroup className="card">
          <div className="row">
        <ListGroup.Item
          className="col-md-12"
          key={commentID}
          action={action()}
          onClick={comment.kids ? onClickHandler : undefined}
        >
        <div className="row">
          <div className="col-8 d-flex">
            <h5>{comment.by}</h5> <span> - {comment.time}</span>
          </div>
          <div className="col-4 float-right">
          {comment.kids !== undefined && (
            <Badge className="float-right" bg="primary">
              {comment.kids.length}
            </Badge>
          )}
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 align-left">
            {comment.deleted === undefined &&
                reactStringReplace(decode(comment.text), "<p>", (match, i) => (
                <br key={i} />
                ))}
            {comment.deleted !== undefined && "COMMENT WAS DELETED"}
            {comment.dead !== undefined && "[DEAD]"}
          </div>
        </div>
        </ListGroup.Item>
        </div>
        {showResults ? nestedComments : null}
      </ListGroup>
    </div>
  );
}
