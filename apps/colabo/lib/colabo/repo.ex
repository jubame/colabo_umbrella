defmodule Colabo.Repo do
  use Ecto.Repo,
    otp_app: :colabo,
    adapter: Ecto.Adapters.Postgres
end
