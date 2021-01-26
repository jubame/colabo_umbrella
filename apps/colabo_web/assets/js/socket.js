// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".

// To use Phoenix channels, the first step is to import Socket,
// and connect at the socket path in "lib/web/endpoint.ex".
//
// Pass the token on params as below. Or remove it
// from the params if you are not using authentication.
import {Socket} from "phoenix"
import {EventBus} from '../main.js'
import {isString} from './utils.js'

let colabo


function initializeColabo() {

  // let socket = new Socket("/socket", {params: {/*token: window.userToken*/}})
  let socket = new Socket("/socket",
    {
      params: {
        token: window.userToken
      },
      timeout: 1000,  // Default 10000
      heartbeatIntervalMs: 3000, // Default 30000,
      logger: function(kind, msg, data) {
        if(kind === 'transport' && isString(msg)){
          console.log(`${kind}: ${msg}`, data)
          let msgLowerCase = msg.toLowerCase()
          if(msgLowerCase.includes('heartbeat') && msgLowerCase.includes('timeout')){
            EventBus.$emit('heartbeat_timeout', null)
          }
        }
        
      }
    }
  )

  console.log(socket)

  socket.onError( () => {
    console.log("there was an error with the connection!")
    EventBus.$emit('socket_error', null)
  })

  socket.onClose( () => console.log("the connection dropped") )
  

  // When you connect, you'll often need to authenticate the client.
  // For example, imagine you have an authentication plug, `MyAuth`,
  // which authenticates the session and assigns a `:current_user`.
  // If the current user exists you can assign the user's token in
  // the connection for use in the layout.
  //
  // In your "lib/web/router.ex":
  //
  //     pipeline :browser do
  //       ...
  //       plug MyAuth
  //       plug :put_user_token
  //     end
  //
  //     defp put_user_token(conn, _) do
  //       if current_user = conn.assigns[:current_user] do
  //         token = Phoenix.Token.sign(conn, "user socket", current_user.id)
  //         assign(conn, :user_token, token)
  //       else
  //         conn
  //       end
  //     end
  //
  // Now you need to pass this token to JavaScript. You can do so
  // inside a script tag in "lib/web/templates/layout/app.html.eex":
  //
  //     <script>window.userToken = "<%= assigns[:user_token] %>";</script>
  //
  // You will need to verify the user token in the "connect/3" function
  // in "lib/web/channels/user_socket.ex":
  //
  //     def connect(%{"token" => token}, socket, _connect_info) do
  //       # max_age: 1209600 is equivalent to two weeks in seconds
  //       case Phoenix.Token.verify(socket, "user socket", token, max_age: 1209600) do
  //         {:ok, user_id} ->
  //           {:ok, assign(socket, :user, user_id)}
  //         {:error, reason} ->
  //           :error
  //       end
  //     end
  //
  // Finally, connect to the socket:
  socket.connect()
  colabo = Colabo(socket)
  return colabo
}



function Colabo(socket) {
  // Now that you are connected, you can join channels with a topic:
  let channel = socket.channel("lobby", {})

  channel.on("new_diff", response => {
    EventBus.$emit('new_diff', response.new_diff)

  })

  channel.on("selection_range", response => {
    EventBus.$emit('selection_range', response.new_diff)

  })


  function join(){
    return channel.join()
  }
  function push(diff){
    channel.push("new_diff", {diff: diff})
    .receive("ok", response => {
      console.log("Server: push ok")
      console.log(response)
    })
    .receive("error", response => {
      console.log("Server: push error")
      console.log(response)
    })
  }

  function pushSelectionRange(range){
    channel.push("selection_range", {range: range})
    .receive("ok", response => {
      console.log("Server: push ok")
      console.log(response)
    })
    .receive("error", response => {
      console.log("Server: push error")
      console.log(response)
    })
  }

  function getDiffs(){
    /*
    Si no pongo el segundo parámetro salta el error
    "TypeError: Cannot read property 'constructor' of null"
    */
    return channel.push("state", {})
    
  }


  return Object.freeze({
    join: join,
    push: push,
    pushSelectionRange: pushSelectionRange,
    getDiffs: getDiffs
  });
  
}







export {initializeColabo, colabo}
