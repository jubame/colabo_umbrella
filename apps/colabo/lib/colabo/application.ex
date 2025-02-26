defmodule Colabo.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      # Colabo.Repo,
      # Start the PubSub system
      {Phoenix.PubSub, name: Colabo.PubSub},
      # Start a worker by calling: Colabo.Worker.start_link(arg)
      # {Colabo.Worker, arg}
      {Colabo.PatchStore, 0}
    ]

    Supervisor.start_link(children, strategy: :one_for_one, name: Colabo.Supervisor)
  end
end
