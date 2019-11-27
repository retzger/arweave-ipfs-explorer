import React from 'react';
import './App.css';
import {
  HashRouter,
  Route,
} from 'react-router-dom';
import { API, MAX_SIZE_SHOW } from './constants';
import ArweaveIpfs from 'arweave-ipfs'
import axios from 'axios';

const fileType = require('file-type');
const textEncoding = require('text-encoding');
const TextDecoder = textEncoding.TextDecoder;
const arw = new ArweaveIpfs({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }, { host: 'arweave.net', port: 443, protocol: 'https', timeout: 50000 });

const BG = "url('chrome://global/skin/media/imagedoc-darknoise.png')";

class App extends React.Component {
  render() {
    return (
      <HashRouter>
        <Route exact path='/' component={Add}></Route>
        <Route exact path='/:hash' component={Display}></Route>
      </HashRouter>
    )
  }
}
class Add extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hashes: "",
      response: "",
      jwk: null,
    }
  }
  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <h1>Arweave-Ipfs Bridge</h1>
        <br />
        <textarea
          style={{
            height: 300,
            width: 600,
            borderWidth: 0,
            fontSize: 15,
          }}
          onChange={(e) => {
            this.setState({ hashes: e.target.value });
          }} placeholder="Paste ipfs hashes, seperate by comma, space or newline" />
        <br />
        <button style={{
          color: "blue",
          padding: 10,
          width: 600,
          cursor: "pointer",
        }}
          onClick={(e) => {
            const hashes = this.state.hashes.split(' ').join(',').split('\n').join(',').split(',');
            var filteredHashes = hashes.filter(Boolean);
            this.add(filteredHashes);
          }}
        >Add to Arweave</button>
        <br />
        <button style={{
          color: "blue",
          padding: 10,
          width: 600,
          cursor: "pointer",
        }}
          onClick={() => document.getElementById('upload').click()}>
          Upload Arweave Wallet ( {API ? `Optional` : "Required"} ) </button>
        <input type="file" id="upload" onChange={e => this.readWallet(e.target.files[0])} style={{ display: "none" }} />
        <br />
        <div style={{
          margin: "auto",
          marginTop: 30,
          background: "#cbcbcb",
          padding: 20,
          width: 800,
        }}>

          {this.state.response ? <PrettyPrintJson data={this.state.response}></PrettyPrintJson> : ""}
        </div>
      </div>)
  }
  readWallet = async (file) => {
    let jwk = JSON.parse(await loadWallet(file));
    this.setState({ jwk });
  }
  add = async (hashes) => {
    try {
      let respones = "";
      if (this.state.jwk) {
        console.log(this.state.jwk);
        respones = await arw.add(hashes, this.state.jwk);
      } else if (API) {
        respones = (await axios.post(`${API}/add`, {
          args: hashes
        })).data;
      } else {
        alert("Wallet is required in serverless explorer!")
      }
      this.setState({ response: respones })
    } catch (e) {
      console.error(e)
    }
  }
}

class PrettyPrintJson extends React.Component {
  render() {
    const { data } = this.props;
    return (<div>{`Responses {ipfs_hash: arweave_txid}`}<pre>{JSON.stringify(data, null, 1)}</pre></div>);
  }
}

class Display extends React.Component {
  constructor(props) {
    super(props);
    this.getHash(this.props.match.params.hash);
    document.title = this.props.match.params.hash;
    this.state = {
      errorMsg: "",
      text: "",
      img: "",
    }
  }
  getHash = async (hash) => {
    try {
      let res;
      if (!API) {
        res = await arw.get(hash);
        console.log(res);
      } else {
        const respones = await axios.get(`${API}/get?args=${hash}`);
        res = respones.data;
      }
      if (res.error) {
        this.setState({ errorMsg: res.error })
        console.error(res.error);
      } else {
        const bytes = new Uint8Array(res[hash]);
        var ftype = fileType(bytes);
        if (bytes.length > MAX_SIZE_SHOW) {
          download(bytes, hash, ftype);
        } else {
          if (ftype === undefined) {
            try {
              var string = new TextDecoder("utf-8").decode(bytes);
              this.setState({ text: string });
            } catch (e) {
              download(bytes, hash, { mime: "text/plain", ext: "" });
              //not a valid string just download the file instead
              console.error(e);
            }
          } else {
            //const url = `data: ${ ftype.mime }; base64, ` + btoa(String.fromCharCode.apply(null, bytes));
            var blob = new Blob([bytes], { type: ftype.mime });
            const url = window.URL.createObjectURL(blob);

            if (ftype.mime.includes("image")) {
              document.body.style.backgroundImage = BG;
              this.setState({ img: url });
            } else if (ftype.mime.includes("audio")) {
              document.body.style.backgroundImage = BG;
              this.setState({ audio: url });
            } else if (ftype.mime.includes("video")) {
              document.body.style.backgroundImage = BG;
              this.setState({ video: url });
            } else {
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
      return (<pre>{this.state.text}</pre>);
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
const loadWallet = (wallet) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => {
      reader.abort()
      reject()
    }
    reader.addEventListener("load", () => { resolve(reader.result) }, false)
    reader.readAsText(wallet)
  })
}

const download = (bytes, hash, ftype) => {
  var blob = new Blob([bytes], { type: ftype.mime });
  var link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = `${hash}.${ftype.ext} `;
  link.click();
}
export default App;
