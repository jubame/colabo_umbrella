defmodule ColaboWeb.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    children = [
      # Start the Telemetry supervisor
      ColaboWeb.Telemetry,
      # Start the Endpoint (http/https)
      ColaboWeb.Endpoint
      # Start a worker by calling: ColaboWeb.Worker.start_link(arg)
      # {ColaboWeb.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: ColaboWeb.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    ColaboWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
