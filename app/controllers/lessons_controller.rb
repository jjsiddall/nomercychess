class LessonsController < ApplicationController

  # GET /lessons
  # GET /lessons.json
  def index
    @lessons = Lesson.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @lessons }
      format.csv { 
        send_data(
          Lesson.to_csv(@lessons),
          :type => 'text/csv',
          :filename => 'lessons.csv',
          :disposition => 'attachment'
        ) 
      }
    end
  end

  # GET /lessons
  # GET /lessons.json
  def builder
    @lessons = Lesson.order("id DESC").all
    @exercises = Exercise.order("sort_for_lesson DESC").all
    respond_to do |format|
      format.html # builder.html.erb
      format.json { render json: @lessons }
    end
  end
  
  # used to download csv of exercises for a specific lesson
  # GET /lessons/1.csv
  def csv
    lesson = Lesson.find(params[:id])
    @exercises = lesson.exercises
    send_data(
      Exercise.to_csv(@exercises),
      :type => 'text/csv',
      :filename => lesson.title + '.csv',
      :disposition => 'attachment'
    )
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
  def quizzes

    if user_signed_in?
      # get all exercises in the lesson
      exercises_to_quiz = Lesson.find(params[:id]).exercise_ids
      
      #get lesson's exercises that have been quizzed
      completed_quizzes = Lesson.find(params[:id]).completions.where(:user_id => current_user.id, :last_completed => 'quiz')

      #remove exercises that have completed quizzes
      completed_quizzes.each do |quizzed|
        exercises_to_quiz.delete(quizzed.exercise_id)
      end

      if exercises_to_quiz.empty?
        redirect_to lesson_path(params[:id])
      else        
        #redirect to the next quiz
        redirect_to quiz_exercise_path(exercises_to_quiz.first)
      end
    end
  
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

  def import
    Lesson.import(params[:file])
    redirect_to builder_lessons_path, notice: "Lessons imported."
  end
end
