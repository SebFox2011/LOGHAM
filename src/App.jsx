import { useState } from 'react'

import { db } from './db'
import { useLiveQuery } from 'dexie-react-hooks'

export function AddFriendForm() {
  const [name, setName] = useState('');
  const [age, setAge] = useState(21);
  const [status, setStatus] = useState('');

  async function addFriend() {
    try {
      // Add the new friend!
      const id = await db.friends.add({
        name,
        age
      });

      setStatus(`Friend ${name} successfully added. Got id ${id}`);
      setName('');
      setAge(21);
    } catch (error) {
      setStatus(`Failed to add ${name}: ${error}`);
    }
  }

  return (
    <div className='flex flex-col '>
      <div className='flex flex-row mb-3'>
        <p>{status}</p>
        Name:
        <input
          type="text"
          value={name}
          onChange={(ev) => setName(ev.target.value)}
        />
      </div>
      <div className='flex flex-row mb-3' >
        Age:
        <input
          type="number"
          value={age}
          onChange={(ev) => setAge(Number(ev.target.value))}
        />
      </div>
      <button className="bg-blue-500 rounded-md p-2 text-white" onClick={addFriend}>Add</button>

    </div>
  );
}

export function FriendList() {
  const friends = useLiveQuery(
    async () => {

      const friends = await db.friends
        .where('age')
        .between(10, 25)
        .toArray();

      // Return result
      return friends;
    },
    // specify vars that affect query:
    [18, 21]
  );

  return (
    <ul>
      {friends?.map((friend) => (
        <li key={friend.id}>
          <span className=" text-white mb-4"> {friend.name}, {friend.age} </span> 
        </li>
      ))}
    </ul>
  );
}

function App() {
  return (
    <div className="border rounded-md max-w-2xl mx-auto p-4 mt-4">

      <h1 className="text-2xl text-white font-bold mb-4">Logger de QSO - LOGHAM</h1>

      <h2 className=" text-white mb-4">Ajouter un QSO</h2>
      <AddFriendForm />

      <h2 className=" text-white mb-4">Friend List</h2>
      <FriendList />
    </div>
  )
}

export default App
