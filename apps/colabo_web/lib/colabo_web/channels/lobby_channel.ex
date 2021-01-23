defmodule ColaboWeb.LobbyChannel do
  use ColaboWeb, :channel
  alias Colabo.PatchStore

  def join("lobby", _message, socket) do
    IO.inspect(PatchStore.state())
    {:ok, socket}
  end


  def handle_in("new_diff", %{"diff" => diff}, socket) do
    IO.puts("PatchStore.state es #{PatchStore.state()}")
    broadcast_from!(socket, "new_diff", %{new_diff: diff})
    IO.inspect(diff)
    {:noreply, socket}
  end


end
