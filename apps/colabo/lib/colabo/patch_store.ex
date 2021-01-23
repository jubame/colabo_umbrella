defmodule Colabo.PatchStore do
  use GenServer

  @me PatchStore

  def start_link(_) do
    GenServer.start_link(__MODULE__, [], name: @me)
  end

  def state() do
    GenServer.call(@me, :state)
  end

  def add(new_patch) do
    GenServer.call(@me, {:add,  new_patch})
  end


  def handle_call(:state, _from, patches) do
    {
      :reply,
      Enum.reverse(patches),
      patches
    }
  end


  def handle_call({:add, new_patch}, _from, patches ) do
    {
      :reply,
      :ok,
      [ new_patch | patches ]
    }
  end


end
