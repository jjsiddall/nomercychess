class HomeController < ApplicationController

  def index
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @lessons }
    end
  end

  def pricing
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @lessons }
    end
  end

end
