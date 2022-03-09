import React, { useState, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import { Badge } from 'react-bootstrap';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { decode } from 'html-entities';
import reactStringReplace from 'react-string-replace';

export default function SingleComment({ commentID }) {
    const [comment, setComment] = useState({});
    const [showResults, setShowResults] = useState(false);
    const onClickHandler = () => setShowResults(!showResults);

    useEffect(() => {

        const fetchData = async () => {
            await fetch(`https://hacker-news.firebaseio.com/v0/item/${commentID}.json?print=pretty`)
                .then(res => res.json())
                .then((result) => {
                    setComment(result);
                },
                (error) => {
                    console.log(error)
                });
            return true;
        }

        fetchData();
        // return () => {
        //     setComment({});
        // };
    }, [commentID]);

    if (!comment) return false;

    const nestedComments = (comment.kids || []).map(c => {
        return <SingleComment key={c} commentID={c} />;
    });

    const action = () => {
        let action = true;
        if(!comment.kids) {
            action = false;
        }
        return action;
    }

    return (
        <div style={{ marginLeft: "50px", marginTop: "10px" }}>
            <ListGroup>
                <ListGroup.Item key={commentID} action={action()} onClick={comment.kids ? onClickHandler : undefined }>
                    {comment.deleted === undefined && reactStringReplace((decode(comment.text)), '<p>', (match, i) => (<br key={i} />))}
                    {comment.deleted !== undefined && 'COMMENT WAS DELETED'}
                    {comment.dead !== undefined && '[DEAD]'}
                    {comment.kids !== undefined &&
                    <Badge className='float-right' bg="primary">
                        {comment.kids.length}
                    </Badge>}
                </ListGroup.Item>
                {showResults ? nestedComments : null}
            </ListGroup>
        </div>
    );
}