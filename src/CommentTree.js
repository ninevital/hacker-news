import React from "react";
import { useParams } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import SingleComment from "./SingleComment";

class CommentTree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postData: [],
      commentsIDS: [],
      comments: [],
      loading: false,
    };
    this.mounted = false;
  }

  decodeEntities(encodedString) {
    var textArea = document.createElement("textarea");
    textArea.innerHTML = encodedString;
    return textArea.value;
  }

  fetcComments = async () => {
    const { id } = this.props.params;
    await fetch(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
    )
      .then((res) => res.json())
      .then(async (result) => {
        this.setState({
          postData: result,
          commentsIDS: [...this.state.commentsIDS, result.kids],
          loading: true,
        });
        const comIDS = this.state.commentsIDS[0];
        if (comIDS !== undefined && comIDS.length !== 0) {
          await Promise.all(
            comIDS.map(async (com) => {
              await fetch(
                `https://hacker-news.firebaseio.com/v0/item/${com}.json?print=pretty`
              )
                .then((res) => res.json())
                .then(
                  (result) => {
                    if (this.mounted === true) {
                      this.setState({
                        comments: [...this.state.comments, result],
                      });
                    }
                  },
                  (error) => {
                    console.log(error);
                  }
                );
              return true;
            })
          );
        }
        this.setState({ loading: false });
      });
  };

  handleClick = () => {
    this.setState({
      postData: [],
      commentsIDS: [],
      comments: [],
      loading: false,
    });
    this.fetcComments();
  };

  componentDidMount() {
    this.mounted = true;
    this.fetcComments();

    this.timerID = setInterval(() => {
      this.setState({
        postData: [],
        commentsIDS: [],
        comments: [],
        loading: false,
      });
      this.fetcComments();
    }, 1000 * 60);
  }

  componentWillUnmount() {
    this.mounted = false;
    clearInterval(this.timerID);
  }

  render() {
    var isLoading = this.state.loading;

    function order(a, b) {
      return a.time > b.time ? -1 : a > b ? 1 : 0;
    }

    const comments = this.state.comments;
    const list = comments.sort(order).map((comment) => {
      return <SingleComment key={comment.id} commentID={comment.id} />;
    });

    return (
      <div className="commentsList">
        <p>Comments:</p>
        <Button
          disabled={this.state.loading}
          className="m-3"
          variant="outline-primary"
          size="lg"
          onClick={this.handleClick}
        >
          Update comments
        </Button>
        {isLoading === true && (
          <div className="p-3">
            <h3>Loading, please wait</h3>
          </div>
        )}
        {isLoading === false && <div>{list}</div>}
      </div>
    );
  }
}

export default (props) => <CommentTree {...props} params={useParams()} />;
