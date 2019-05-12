import * as React from "react";
import { Card, CardTitle, CardText } from "react-md";

export default ({ error }) => {
  let body: any = null;
  if (error.graphQLErrors && error.graphQLErrors.length) {
    body = error.graphQLErrors.map(error => (
      <CardText>{error.message}</CardText>
    ));
  } else if (error.message) {
    body = <CardText>{error.message}</CardText>;
    return (
      <Card>
        <div className="alert-danger">
          <CardTitle title="Error" />
        </div>
      </Card>
    );
  } else {
    body = <CardText> Unknown error happened :( </CardText>;
  }
  return (
    <Card>
      <div className="alert-danger">
        <CardTitle title="Error" />
        {body}
      </div>
    </Card>
  );
};
