defmodule ColaboWeb.LobbyChannel do
  use ColaboWeb, :channel

  def join("lobby", _message, socket) do
    {:ok, socket}
  end


  def handle_in("new_diff", %{"diff" => diff}, socket) do
    #broadcast!(socket, "new_msg", %{body: body})
    IO.inspect(diff)
    {:noreply, socket}
  end


end
