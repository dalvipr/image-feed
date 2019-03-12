import React, { Component } from 'react';
import './App.css';
import { Button, Grid, Header,Form, Icon,Segment, Message } from 'semantic-ui-react'
import axios from 'axios';
import 'semantic-ui-css/semantic.min.css';

class App extends Component {

  constructor() {
    super();
    this.state = {
      data: [],
      image: '',
      url: '',
      title: '',
      loading: false,
      errors: []
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  displayError = (errors) => errors.map((error, index) => {
    return (
      <p key={index}>{error.message}</p>
    )
  })

  isFormValid = () => {
    let errors = [];
    let error;

    if (this.isFormEmpty(this.state)) {
      error = { message: "All fields are  required" };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else {
      return true;
    }
  }

  isFormEmpty = (state) => {
    return !state.url.length || !state.title.length;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.isFormValid()) { 
      this.setState({
        errors: [],
        loading: true
      })
      axios.get(this.state.url)
        .then(res => {
          const newData = this.state.data;
          console.log(res.request.responseURL);
          const imageFeed = {
            url: this.state.url,
            title: this.state.title,
            id: this.state.data.length + 1
          }
          newData.push(imageFeed)
          this.setState({
            data: newData,
            title: '',
            url: '',
            loading: false
          })

        })
        .catch(err => {
          console.log(err);
          this.setState({
            title: '',
            url: '',
            loading: false,
            errors: this.state.errors.concat({ message: "Sorry unable to find the Image" })
          })
        })
    }
    
  }



  render() {
    const {url, title, loading, errors} = this.state;
    return (
      <div className="App">
        <Grid textAlign="center" verticalAlign="middle" className="app">
          <Grid.Column style={{ maxWidth: 700 }}>
            <Header as="h2" icon inverted textAlign="center">
              <Icon circular name='image' />
              Image Feed
          </Header>
            {errors.length > 0 && (
              <Message error>{this.displayError(errors)}</Message>
            )}
            <Form onSubmit={this.handleSubmit} size="large">
              <Segment stacked>
                <Form.Input
                  fluid
                  name="url"
                  icon="file image"
                  iconPosition="left"
                  placeholder="Enter URL"
                  onChange={this.handleChange}
                  type="text"
                  value={url}
                />
                <Form.Input
                  fluid
                  name="title"
                  icon="pencil alternate"
                  iconPosition="left"
                  placeholder="Title"
                  onChange={this.handleChange}
                  type="text"
                  value={title}
                />
                <Button
                  disabled={loading}
                  className={loading ? 'loading' : ''}
                  fluid color="blue" size="large">Submit</Button>
              </Segment>
            </Form>
            
          </Grid.Column>
        </Grid>
        <Grid textAlign="center">
          {
            this.state.data.length > 0 && 
            this.state.data.map(info => (
              <div key={info.id} className='image-gallery'>
                <div className='gallery-style'>
                  <h2 style={{ color: '#000000' }}>{info.title}</h2>
                  <img alt={info.title} src={info.url} style={{ height: '490px', width: '650px' }} />
                </div>
              </div>
            ))
          }
        </Grid>
       
      </div>
    );
  }
}

export default App;
