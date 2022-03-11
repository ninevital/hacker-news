import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Link } from "react-router-dom";

class News extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postsId: [],
      posts: [],
      loading: false,
    };
  }

  fetchNews = async () =>
    await fetch(
      "https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty"
    )
      .then((res) => res.json())
      .then(async (result) => {
        const topResults = result.slice(0, 100);
        this.setState({ postsId: topResults });
        await Promise.all(
          topResults.map(async (post) => {
            await fetch(
              `https://hacker-news.firebaseio.com/v0/item/${post}.json?print=pretty`
            )
              .then((res) => res.json())
              .then(
                (result) => {
                  this.setState({
                    posts: [...this.state.posts, result],
                    loading: true,
                  });
                },
                (error) => {
                  console.log(error);
                }
              );
            return true;
          })
        );
        this.setState({ loading: false });
      });

  componentDidMount() {
    this.fetchNews();

    this.timerID = setInterval(() => {
      this.setState({ posts: [] });
      this.fetchNews();
    }, 1000 * 60);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  handleClick = () => {
    this.setState({ posts: [] });
    this.fetchNews();
  };

  render() {
    const post = this.state.posts;

    function order(a, b) {
      return a.time > b.time ? -1 : a > b ? 1 : 0;
    }
    const getDate = (ms) => {
      var date = new Date(ms * 1000);
      return date.toString();
    };

    const listItems = post.sort(order).map((post) => (
      <Card className="text-center mb-3" key={post.id}>
        <Card.Header>{post.by}</Card.Header>
        <Card.Body>
          <Card.Title>{post.title}</Card.Title>
          <Card.Text>Rating: {post.score}</Card.Text>
          <Card.Text>Comments: {post.descendants}</Card.Text>
          <Button className="mx-3" variant="primary">
            <Link
              style={{ textDecoration: "none", color: "white" }}
              to={`/news/${post.id}`}
            >
              See comments
            </Link>
          </Button>
          {post.url !== undefined && (
            <Button
              variant="primary"
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Go to source
            </Button>
          )}
        </Card.Body>
        <Card.Footer className="text-muted">{getDate(post.time)}</Card.Footer>
      </Card>
    ));

    var isLoading = this.state.loading;

    return (
      <div className="d-flex flex-column p-2">
        <Button
          disabled={this.state.loading}
          className="m-3"
          variant="outline-primary"
          size="lg"
          onClick={this.handleClick}
        >
          Update newsfeed
        </Button>
        {isLoading === true && (
          <div className="p-3">
            <h3>Loading, please wait</h3>
          </div>
        )}
        {isLoading === false && <div>{listItems}</div>}
      </div>
    );
  }
}

export default News;
