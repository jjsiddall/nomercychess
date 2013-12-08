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
  def usedids
    @lessons = Lesson.all
    @exercises = Exercise.all
    @moves = Move.all
    respond_to do |format|
      format.html # index.html.erb
    end
  end

end
