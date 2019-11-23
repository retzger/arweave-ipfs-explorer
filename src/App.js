import React from 'react';
import './App.css';
import {
  HashRouter,
  Route,
} from 'react-router-dom';
import {API, MAX_SIZE_SHOW} from './constants';
import ArweaveIpfs from 'arweave-ipfs'


const got = require('got');
const fileType = require('file-type');
const textEncoding = require('text-encoding');
const TextDecoder = textEncoding.TextDecoder;
const arw = new ArweaveIpfs();

class App extends React.Component {
  render() {
    return (
      <HashRouter>
        <Route exact path='/:hash' component={Display}></Route>
      </HashRouter>
    )
  }
}

class Display extends React.Component {
  constructor(props) {
    super(props);
    this.getHash(this.props.match.params.hash);

    this.state = {
      errorMsg: "",
      text: "",
      img: "",
    }
  }
  getHash = async (hash) => {
    try {
      let res;
      if(!API){
        res = await arw.get(hash);
      }else{
        const respones = await got(`${API}/get?args=${hash}`);
        res = JSON.parse(respones.body);
      }
      if (res.error) {
        this.setState({ errorMsg: res.error })
        console.error(res.error);
      } else {
        const bytes = new Uint8Array(res[hash]);
        var ftype = fileType(bytes);
        if (bytes.length > MAX_SIZE_SHOW) {
          download(bytes, hash, ftype);          
        }else{
          if (ftype === undefined) {
            try {
              var string = new TextDecoder("utf-8").decode(bytes);
              this.setState({ text: string });
            } catch (e) {
              download(bytes, hash, {mime: "text/plain", ext: ""});
              //not a valid string just download the file instead
              console.error(e);
            }
          } else {
            //const url = `data:${ftype.mime};base64,` + btoa(String.fromCharCode.apply(null, bytes));
            var blob = new Blob([bytes], {type: ftype.mime});
            const url = window.URL.createObjectURL(blob);

            if (ftype.mime.includes("image")) {
              this.setState({ img: url });
            } else if (ftype.mime.includes("audio")) {
              this.setState({ audio: url });  
            } else if (ftype.mime.includes("video")) {
              this.setState({ video: url });
            }else{
              download(bytes, hash, ftype);
            }
          }
        }
      }
    } catch (e) {
      this.setState({ errorMsg: "Server Error, See logs" })
      console.error(e);
    }
    //const bytes = got[hash];
  }
  render() {
    const hash = this.props.match.params.hash;
    if (this.state.text) {
      return this.state.text;
    } else if (this.state.img) {
      return (<img src={this.state.img} alt={hash} />);
    } else if (this.state.audio) {
      return (<video autoplay controls src={this.state.audio} style={{ height: 40, width: '66%' }} />);
    } else if (this.state.video) {
      return (<video autoplay controls src={this.state.video} />);
    } else {
      return (null)
    }
  }
}
const download = (bytes, hash, ftype) => {
  var blob=new Blob([bytes], {type: ftype.mime});
  var link=document.createElement('a');
  link.href=window.URL.createObjectURL(blob);
  link.download= `${hash}.${ftype.ext}`;
  link.click();  
}
export default App;
