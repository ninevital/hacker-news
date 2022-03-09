import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useParams } from "react-router-dom";
import CommentTree from './CommentTree';
import { decode } from 'html-entities';
import reactStringReplace from 'react-string-replace';

class NewsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            postData: {},
        };
    }

    componentDidMount() {
        const { id } = this.props.params;

        const fetchNewsData = async () =>
            await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`)
                .then(res => res.json())
                .then((result) => {
                    this.setState({ postData: result });
                },
                    (error) => {
                        console.log(error)
                    });

        fetchNewsData();
    }

    render() {
        const post = this.state.postData;

        const getDate = (ms) => {
            var date = new Date(ms * 1000);
            return date.toString();
        }

        return (
            <Card className="text-center mb-3" key={post.id}>
                <Card.Header>{post.by}</Card.Header>
                <Card.Body>
                    <Card.Title>{post.title}</Card.Title>
                    <Card.Text>Rating: {post.score}</Card.Text>
                    {post.url !== undefined &&
                        <Button variant="primary" href={post.url} target="_blank" rel="noopener noreferrer">Go to source</Button>
                    }
                    {post.url === undefined &&
                        <p>{reactStringReplace((decode(post.text)), '<p>', (match, i) => (<br key={i} />))}</p>
                    }
                </Card.Body>
                <CommentTree />
                <Card.Footer className="text-muted">{getDate(post.time)}</Card.Footer>
            </Card>

        )
    }
}

export default (props) => (
    <NewsPage
        {...props}
        params={useParams()}
    />
);

// export default NewsPage;