defmodule ColaboWeb.LobbyChannel do
  use ColaboWeb, :channel

  def join("lobby", _message, socket) do
    {:ok, socket}
  end

end
