import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from "./lottery";

class App extends Component {

  state = {
    managerAddress:"",
    players:[],
    balance : "",
    value : "",
    message : ""
  }
  async componentDidMount(){
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({managerAddress : manager,players,balance});
  }

  onSubmit = async event=>{
    // 阻止浏览器默认提交，点提交页面不会刷新页面,在同一个页面做展示
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();

    this.setState({message:"等待交易完成......"});

    await lottery.methods.enetr().send({from:accounts[0],value:web3.utils.toWei(this.state.value,'ether')});

    this.setState({message:"交易已完成......"});
  }
  onClick = async ()=>{
    const accounts = await web3.eth.getAccounts();
    this.setState({message:"等待交易完成......"});
    await lottery.methods.pickwiner().send({from:accounts[0]});
    this.setState({message:"赢家产生"});
  }

  render() {
    console.log(web3.version);
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div>欢迎来到搏彩中心</div>
          <div>
              <p>参与者地址： <span>{this.state.managerAddress}</span></p>
              <p>当前参与者的数量： <span>{this.state.players.length}</span></p>
              <p>当前的资金池：<span>{web3.utils.fromWei(this.state.balance,'ether')}</span></p>
              <hr/>
              <form onSubmit = {this.onSubmit}>
                  <h4>想要参与到博彩项目？</h4>
                  <div>
                    <label>请输入你想参与的金额:</label>
                    <input value = {this.state.value} onChange={event =>{
                      this.setState({value:event.target.value})
                    }}/>
                  </div>
                  <button>提交</button>
              </form>
              <hr/>
              <h4>判断输赢</h4>
              <button onClick={this.onClick}>开始博彩</button>
              <p>{this.state.message}</p>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
