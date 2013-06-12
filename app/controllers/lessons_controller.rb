class LessonsController < ApplicationController

  # GET /lessons
  # GET /lessons.json
  def index
    @lessons = Lesson.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @lessons }
    end
  end

  # GET /lessons
  # GET /lessons.json
  def builder
    @lessons = Lesson.order("id DESC").all
    @exercises = Exercise.order("sortForLesson DESC").all
    respond_to do |format|
      format.html # builder.html.erb
      format.json { render json: @lessons }
    end
  end
  
  # GET /lessons/1
  # GET /lessons/1.json
  def show
    @lesson = Lesson.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @lesson }
    end
  end

  # GET /lessons/1
  # GET /lessons/1.json
  def quiz

    if user_signed_in?
      # Search for a "Completion of the selected Exercise and User" 
      # @completions = Completion.where( :user_id => current_user.id, :last_completed => "exercise")
       @completions = Lesson.find(params[:id]).completions.where( :user_id => current_user.id, :last_completed => "exercise")
      #@completions = Lesson(13).completions.where( :user_id => current_user.id, :last_completed => "exercise")

#this is where I am leaving off for the night
      redirect_to practice_exercise_path(@completions.first.exercise_id)


    end

    # respond_to do |format|
    #   format.html # show.html.erb
    #   format.json { render json: @lesson }
    # end

    # @next_exercise = @exercise.lesson.next_exercise(@exercise)
    # User.mark_exercise_complete(@exercise)
    # if !@next_exercise
    #   redirect_to @exercise.lesson.next_quiz
    # else
    #   User.start_exercise(@next_exercise) 
    # end
  
  end

  # GET /lessons/new
  # GET /lessons/new.json
  def new
    @lesson = Lesson.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @lesson }
    end
  end

  # GET /lessons/1/edit
  def edit
    @lesson = Lesson.find(params[:id])
  end

  # POST /lessons
  # POST /lessons.json
  def create
    @lesson = Lesson.new(params[:lesson])

    respond_to do |format|
      if @lesson.save
        format.html { redirect_to builder_lessons_path, notice: 'Lesson was successfully created.' }
        format.json { render json: @lesson, status: :created, location: @lesson }
      else
        format.html { render action: "new" }
        format.json { render json: @lesson.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /lessons/1
  # PUT /lessons/1.json
  def update
    @lesson = Lesson.find(params[:id])

    respond_to do |format|
      if @lesson.update_attributes(params[:lesson])
        format.html { redirect_to builder_lessons_path, notice: 'Lesson was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @lesson.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /lessons/1
  # DELETE /lessons/1.json
  def destroy
    @lesson = Lesson.find(params[:id])
    @lesson.destroy

    respond_to do |format|
      format.html { redirect_to builder_lessons_path }
      format.json { head :no_content }
    end
  end

  def clone
    @lesson = Lesson.find(params[:id]).dup

    if @lesson.save
      flash[:notice] = 'Item was successfully cloned.'
    else
      flash[:notice] = 'ERROR: Item can\'t be cloned.'
    end

    redirect_to(builder_lessons_path)
  end 

end
