import React, { Component } from "react";
// import swal from "sweetalert";
import axios from "axios";
import { Button, TextField, Link } from "@material-ui/core";
import { withRouter } from "./utils";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      confirm_password: ''
    };
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  register = () => {

    axios.post('http://localhost:2000/register', {
      username: this.state.username,
      password: this.state.password,
    }).then((response) => response.json()) 
    .then((data) => (data.title))
      // swal({
      //   text: data.title,
      //   icon: "success"
      // });
      // this.props.history.push('/');
      
    .catch((error) => console.error('Error fetching regiter data:', error));
    this.props.navigate("/")
      // swal({
      //   text: err.response,
      //   icon: "error"
      // });
    // });
  }

  render() {
    return (
      <div className="login">
        <div>
          <h2>Register</h2>
        </div>

        <div>
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="username"
            value={this.state.username}
            onChange={this.onChange}
            placeholder="User Name"
            required
          />
          <br /><br />
          <TextField
            id="standard-basic"
            type="password"
            autoComplete="off"
            name="password"
            value={this.state.password}
            onChange={this.onChange}
            placeholder="Password"
            required
          />
          <br /><br />
          <TextField
            id="standard-basic"
            type="password"
            autoComplete="off"
            name="confirm_password"
            value={this.state.confirm_password}
            onChange={this.onChange}
            placeholder="Confirm Password"
            required
          />
          <br /><br />
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            disabled={this.state.username === '' && this.state.password === ''}
            onClick={this.register}
          >
            Register
          </Button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Link
            // href="/"
            component="button"
            style={{ fontFamily: "inherit", fontSize: "inherit" }}
            onClick={() => {
              this.props.navigate("/");
            }}
          >
            Login
          </Link>
        </div>
      </div>
    );
  }
}

export default withRouter(Register);
