import { useLayoutEffect } from "react";
import {useState} from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Rakib",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Rahat",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Sanaullah",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];


function Button ({children, onClick}) {
    return(
        <button className="button" onClick={onClick}>{children}</button>
    );
}

export default function App(){
    const[showAddFriend, setShowAddFriend] = useState(false);
    const[friend, setFriend] = useState(initialFriends);
    const[selectedFriend, setSelectedFriend] = useState(null);

    function handleShowAddFriend() {
      setShowAddFriend((show) => !show);
    }

   function addFriend(newFriend) {
     setFriend([...friend, newFriend]);
     setShowAddFriend(false);
   }

   function handleSelection(friend){
        setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
        setShowAddFriend(false);
   }

   function handleSplitBill(value){
        setFriend(friends => friends.map(friend => friend.id === selectedFriend.id ? {...friend, balance: friend.balance + value}: friend))

        setSelectedFriend(null)
   }

    return(
        <div className="app">
            <div className="sidebar">
                <FriendList 
                    friends = {friend} 
                    onSelection={handleSelection}
                    selectedFriend ={selectedFriend}
                />

                {showAddFriend && <FormAddFriend onAddFriend={addFriend}/>}
                
                <Button onClick={handleShowAddFriend}>{ showAddFriend ? "Close" : "Add Friend"}</Button>
            </div>

            {selectedFriend && 
                <FormSplitBill 
                    selectedFriend={selectedFriend}
                    onSplitBill = {handleSplitBill}
                />}
        </div>
    )
}

function FriendList({friends, onSelection, selectedFriend}){
    return (
        <ul>
            {friends.map(friend => 
                <Friend 
                    friend={friend} 
                    onSelection={onSelection} 
                    key ={friend.id}
                    selectedFriend ={selectedFriend}
                />
            )}
        </ul>
    )
}


function Friend({friend,onSelection, selectedFriend}){

    const isSelected = selectedFriend?.id === friend.id;

    return(
        <li className={isSelected ? 'selected' :''}>

            <img src={friend.image} alt={friend.name} />
            <h3>{friend.name}</h3>

            {friend.balance < 0 && (
                <p className="red">
                    You owe {friend.name} ৳{Math.abs(friend.balance)}
                </p>
            )}

            {friend.balance > 0 && (
                <p className="green">
                    {friend.name} owes you ৳{Math.abs(friend.balance)}
                </p>
            )}

            {friend.balance === 0 && (
                <p>
                    You and {friend.name} are even
                </p>
            )}

            <Button onClick={()=>onSelection(friend)}>{isSelected ? "close" : 'Select'}</Button>
        </li>
    )
}


function FormAddFriend ({onAddFriend}) {
    const[name,setName] = useState('');
    const[image,setImage] = useState('https://i.pravatar.cc/48');

    function handleSubmit(e) {
        e.preventDefault();
        if(!name || !image) return;

        const id = crypto.randomUUID()

        const newFriend = {
        id,
        balance: 0,
        name,
        image:`${image}?=${id}`,
      }

      onAddFriend(newFriend);

      setName('');
      setImage('https://i.pravatar.cc/48');

    };

    return(
        <form className="form-add-friend" onSubmit={handleSubmit}>
            <label>🐵Friend Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>

            <label>🌅 Image URL</label>
            <input type="text" value={image} onChange={(e)=> setImage(e.target.value)}/>

            <Button>Add</Button>
        </form>
    );
}

function FormSplitBill ({selectedFriend, onSplitBill}) {

    

    const [bill, setBill] = useState('');
    const [paidByUser, setPaidByUser] = useState('');
    const [whoIsPaying, setWhoIsPaying] = useState("user");

    const paidByFriend = bill ? bill - paidByUser : "";

    function handleSubmit(e){
        e.preventDefault();

        if(!bill || !paidByUser) return;
        onSplitBill(whoIsPaying === 'user' ? paidByFriend : -paidByUser);
    }

    return(
        <form className="form-split-bill" onSubmit={handleSubmit}>
            <h2>
                Split a bill with {selectedFriend.name}
            </h2>
            <label>💰 Bill Value</label>
            <input 
                type="text" 
                value={bill} 
                onChange={(e) => setBill(Number(e.target.value))}
            />

            <label>💀 Your expenses</label>
            <input 
                type="text"
                value={paidByUser} 
                onChange={(e) => setPaidByUser(
                                    Number(e.target.value) > bill ? paidByUser :
                                    Number(e.target.value)
                )
            }
             />

            <label>🐵 {selectedFriend.name}'s expense</label>
            <input type="text" disabled value={paidByFriend}/>

            <label>💵 Who is paying the bill</label>
            <select
                value={whoIsPaying} 
                onChange={(e) => setWhoIsPaying(e.target.value)}
            >
                <option value='user'>You</option>
                <option value="friend">{selectedFriend.name}</option>
            </select>

            <Button>Split bill</Button>
        </form>
    );
}