require "spec_helper"

describe CompletionsController do
  describe "routing" do

    it "routes to #index" do
      get("/completions").should route_to("completions#index")
    end

    it "routes to #new" do
      get("/completions/new").should route_to("completions#new")
    end

    it "routes to #show" do
      get("/completions/1").should route_to("completions#show", :id => "1")
    end

    it "routes to #edit" do
      get("/completions/1/edit").should route_to("completions#edit", :id => "1")
    end

    it "routes to #create" do
      post("/completions").should route_to("completions#create")
    end

    it "routes to #update" do
      put("/completions/1").should route_to("completions#update", :id => "1")
    end

    it "routes to #destroy" do
      delete("/completions/1").should route_to("completions#destroy", :id => "1")
    end

  end
end
