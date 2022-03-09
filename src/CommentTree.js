import React from 'react';
import { useParams } from "react-router-dom";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import SingleComment from './SingleComment';

class CommentTree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            postData: [],
            commentsIDS: [],
            comments: [],
        };
        this._isMounted = false;
    }

    decodeEntities(encodedString) {
        var textArea = document.createElement('textarea');
        textArea.innerHTML = encodedString;
        return textArea.value;
    }

    fetcComments = async () => {
        const { id } = this.props.params;
        await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`)
            .then(res => res.json())
            .then(async (result) => {
                this.setState({ postData: result, commentsIDS: [...this.state.commentsIDS, result.kids] });
                const comIDS = this.state.commentsIDS[0];
                if (comIDS.length !== 0) {
                    await Promise.all(
                        comIDS.map(async (com) => {
                            await fetch(`https://hacker-news.firebaseio.com/v0/item/${com}.json?print=pretty`)
                                .then(res => res.json())
                                .then((result) => {
                                    if (this._isMounted) {
                                        this.setState({ comments: [...this.state.comments, result] });
                                    }
                                },
                                    (error) => {
                                        console.log(error)
                                    });
                            return true;
                        })
                    );
                }

            })
    };

    componentDidMount() {
        this._isMounted = true;
        this.fetcComments();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        function order(a, b) {
            return a.time > b.time ? -1 : (a > b ? 1 : 0);
        }

        //   const getDate = (ms) => {
        //     var date = new Date(ms * 1000);
        //     return date.toString(); 
        //   }

        const comments = this.state.comments;
        const list = comments.sort(order).map((comment) => {
            return <SingleComment key={comment.id} commentID={comment.id} />;
        })

        return (
            <div>
                {list}
            </div>
        );
    }
}

export default (props) => (
    <CommentTree
        {...props}
        params={useParams()}
    />
);