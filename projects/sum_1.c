#include <stdio.h>
#include <math.h>

int main(){
	int n;
	printf("Enter your number\n");
	scanf("%d",&n);
	float result = log(2+(2*n-1));
	printf("your result is %f\n",result);
	return 0;
}