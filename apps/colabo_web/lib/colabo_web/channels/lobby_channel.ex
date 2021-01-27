defmodule ColaboWeb.LobbyChannel do
  use ColaboWeb, :channel
  alias Colabo.PatchStore

  def join("lobby", _message, socket) do
    IO.inspect(PatchStore.state())
    {:ok, socket}
  end

  def handle_in("state", _params, socket) do
    IO.puts("ESTAMOS EN STATE")
    {:reply, {:ok, PatchStore.state()}, socket}
  end


  def handle_in("new_patch", %{"patch" => patch}, socket) do
    IO.puts("PatchStore.state es #{inspect(PatchStore.state())}")
    PatchStore.add(patch)
    broadcast_from!(socket, "new_patch", %{peer_data: socket.assigns.peer_data, new_patch: patch})
    IO.inspect(patch)
    {:reply, :ok, socket}
  end

  def handle_in("selection_range", %{"range" => range}, socket) do
    IO.inspect(range)
    IO.inspect(socket)
    broadcast_from!(socket, "selection_range", %{peer_data: socket.assigns.peer_data, range: range})
    {:reply, :ok, socket}
  end


end
