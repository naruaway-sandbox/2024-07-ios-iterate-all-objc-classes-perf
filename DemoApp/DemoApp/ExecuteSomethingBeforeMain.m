#import <Foundation/Foundation.h>
#import <objc/runtime.h>


@interface ExecuteSomethingBeforeMain: NSObject

@end


@implementation ExecuteSomethingBeforeMain

+ (void)load {
    NSDate *date = NSDate.date;
#ifdef ExecuteSomethingBeforeMainIterateAllObjcClasses
    SEL selector = @selector(_someSelectorToBeFound);

    int numClasses = objc_getClassList(NULL, 0);
    Class* classes = (Class *)malloc(sizeof(Class) * numClasses);
    numClasses = objc_getClassList(classes, numClasses);

    //int loopCount = 0;
    for (int i = 0; i < numClasses; i++) {
        Class class = classes[i];
        //NSLog(@"numClasses: %d", numClasses);
        unsigned int numMethods = 0;
        Method *methods = class_copyMethodList(object_getClass(class), &numMethods);
        for (int j = 0; j < numMethods; j++) {
            //++loopCount;
            Method method = methods[j];
            if (sel_isEqual(method_getName(method), selector)) {
                IMP imp = method_getImplementation(method);
                ((void (*)(Class, SEL))imp)(class, selector);
                continue;
            }
        }
        free(methods);
    }
    //NSLog(@"loopCount: %d", loopCount);
    free(classes);
#endif
    //NSLog(@"ExecuteSomethingBeforeMain duration: %f", -date.timeIntervalSinceNow);
}

@end
