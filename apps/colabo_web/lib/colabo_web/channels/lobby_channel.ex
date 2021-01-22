defmodule ColaboWeb.LobbyChannel do
  use ColaboWeb, :channel

  def join("lobby", _message, socket) do
    {:ok, socket}
  end


  def handle_in("new_diff", %{"diff" => diff}, socket) do
    broadcast_from!(socket, "new_diff", %{new_diff: diff})
    IO.inspect(diff)
    {:noreply, socket}
  end


end
