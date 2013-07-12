class ExercisesController < ApplicationController
  # GET /exercises
  # GET /exercises.json
  def index
    @exercises = Exercise.all
    @move = Move.new

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @exercises }
      format.csv { 
        send_data(
          Exercise.to_csv(@exercises),
          :type => 'text/csv',
          :filename => 'exercises.csv',
          :disposition => 'attachment'
        ) 
      }
    end
  end

  # used to download csv of moves for a specific exercise
  # GET /exercises/1.csv
  def csv
    exercise = Exercise.find(params[:id])
    @moves = exercise.moves
    send_data(
      Move.to_csv(@moves),
      :type => 'text/csv',
      :filename => exercise.title + '.csv',
      :disposition => 'attachment'
    )
  end

  # GET /exercises/1
  # GET /exercises/1.json
  def show
    
    # See if the user is signed in
    if user_signed_in?
      # Search for a "Completion of the selected Exercise and User" 
      @completion = Completion.where(:exercise_id =>params[:id], :user_id => current_user.id, :last_completed => "exercise").first
    end

    @exercise = Exercise.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @exercise }
    end
  end

  # GET /exercises/1
  # GET /exercises/1.json
  def practice
    # See if the user is signed in
    if user_signed_in?
      # Search for a "Completion of the selected Exercise and User" 
      @completion = Completion.where(:exercise_id =>params[:id], :user_id => current_user.id, :last_completed => "practice").first
    end
    
    @exercise = Exercise.find(params[:id])
    
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @exercise }
    end
  end
  
  # GET /exercises/1
  # GET /exercises/1.json
  def quiz
    # See if the user is signed in
    if user_signed_in?
      # Search for a "Completion of the selected Exercise and User" 
      @completion = Completion.where(:exercise_id =>params[:id], :user_id => current_user.id, :last_completed => "quiz").first
      @completed_quizzes = Completion.where(:user_id => current_user.id, :last_completed => "quiz").count
      @completed_quizzes = @completed_quizzes+1
    end

    @exercise = Exercise.find(params[:id])
    
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @exercise }
    end
  end

  # GET /exercises/new
  # GET /exercises/new.json
  def new
    @exercise = Exercise.new
    @move = Move.new
    
    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @exercise }
    end
  end

  # GET /exercises/1/edit
  def edit
    @exercise = Exercise.find(params[:id])
    @move = Move.new
  end

  # # GET /exercises/1/builder
  # def builder
  #   @exercise = Exercise.find(params[:id])
  #   @move = Move.new
  # end

  # POST /exercises
  # POST /exercises.json
  def create
    @exercise = Exercise.new(params[:exercise])

    respond_to do |format|
      if @exercise.save
        format.html { redirect_to edit_exercise_path(@exercise), notice: 'Exercise was successfully created.' }
        format.json { render json: @exercise, status: :created, location: @exercise }
      else
        format.html { render action: "new" }
        format.json { render json: @exercise.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /exercises/1
  # PUT /exercises/1.json
  def update
    @exercise = Exercise.find(params[:id])

    respond_to do |format|
      if @exercise.update_attributes(params[:exercise])
        format.html { redirect_to edit_exercise_path(@exercise), notice: 'Exercise was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @exercise.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /exercises/1
  # DELETE /exercises/1.json
  def destroy
    @exercise = Exercise.find(params[:id])
    @exercise.destroy

    respond_to do |format|
      format.html { redirect_to exercises_url }
      format.json { head :no_content }
    end
  end

  def clone
    @exercise = Exercise.find(params[:id]).dup

    if @exercise.save
      flash[:notice] = 'Item was successfully cloned.'
    else
      flash[:notice] = 'ERROR: Item can\'t be cloned.'
    end

    redirect_to(builder_lessons_path)
  end 

  def import
    Exercise.import(params[:file])
    redirect_to builder_lessons_path, notice: "Exercises imported."
  end

end
