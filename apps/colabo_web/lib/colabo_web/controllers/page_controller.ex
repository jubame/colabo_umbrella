defmodule ColaboWeb.PageController do
  use ColaboWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
