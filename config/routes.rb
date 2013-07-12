NoMercyChess::Application.routes.draw do
  resources :completions

  resources :lessons do 
    collection do
      #used for lesson building
      get 'builder'
    end
    member do
      #used for a "test" at the end of a lesson
      get 'quizzes'
      get 'clone'
      get 'csv'
    end
  end

  resources :exercises do
    collection do
      get :csv
      post :import
    end
    member do
      get 'practice'
      get 'clone'
      get 'quiz'
      get 'csv'
      # get 'builder'
    end
  end
  resources :moves do
    collection do
      get :csv
      post :import
    end
  end

  mount StripeEvent::Engine => '/stripe'
  get "content/gold"
  get "content/silver"
  get "content/platinum"

  authenticated :user do
    root :to => 'home#index'
  end
  root :to => "home#index"
  
  devise_for :users, :controllers => { :registrations => 'registrations' }
  devise_scope :user do
    put 'update_plan', :to => 'registrations#update_plan'
    put 'update_card', :to => 'registrations#update_card'
  end
  resources :users

  get "home/pricing" 

end