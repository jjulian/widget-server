WidgetServer::Application.routes.draw do
  resources :users do
    get :upvote
  end
  root :to => 'users#index'
end
